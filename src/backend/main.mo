import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import Migration "migration";
import Set "mo:core/Set";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // ========== Types ==========

  type Comment = {
    id : Nat;
    articleId : Nat;
    author : Principal;
    content : Text;
    createdAt : Time.Time;
  };

  module Article {
    public type Category = {
      #stock;
      #crypto;
      #property;
      #finance;
      #economicHistory;
    };
    public func compare(article1 : Article, article2 : Article) : Order.Order {
      Nat.compare(article1.id, article2.id);
    };

    public type Article = {
      id : Nat;
      title : Text;
      content : Text;
      category : Category;
      author : Principal;
      publishedAt : Time.Time;
      coverImageUrl : Text;
      tags : [Text];
      excerpt : Text;
      likes : Set.Set<Principal>;
      bookmarks : Set.Set<Principal>;
    };

    public type ArticleView = {
      id : Nat;
      title : Text;
      content : Text;
      category : Category;
      author : Principal;
      publishedAt : Time.Time;
      coverImageUrl : Text;
      tags : [Text];
      excerpt : Text;
      likes : [Principal];
      bookmarks : [Principal];
    };

    public func toView(article : Article) : ArticleView {
      {
        article with
        likes = article.likes.toArray();
        bookmarks = article.bookmarks.toArray();
      };
    };
  };

  type ArticleInput = {
    title : Text;
    content : Text;
    category : Article.Category;
    coverImageUrl : Text;
    tags : [Text];
    excerpt : Text;
  };

  public type UserRole = {
    #writer;
    #reader;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    photoUrl : Text;
    role : UserRole;
  };

  // ========== Component Communication ==========

  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ========== State ==========

  var nextArticleId = 1;
  var nextCommentId = 1;

  let articles = Map.empty<Nat, Article.Article>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let comments = Map.empty<Nat, Comment>();

  // ========== User Profile Functions ==========

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query func getPublicAuthorProfile(author : Principal) : async ?UserProfile {
    userProfiles.get(author);
  };

  // ========== Helper Functions ==========

  func getArticleInternal(id : Nat) : Article.Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article does not exist") };
      case (?article) { article };
    };
  };

  func isWriter(caller : Principal) : Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return false;
    };
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#writer) { true };
          case (#reader) { false };
        };
      };
    };
  };

  func filterArticles(pred : Article.Article -> Bool) : [Article.Article] {
    articles.values().toArray().filter(pred);
  };

  // ========== Article Functions ==========

  public shared ({ caller }) func createArticle(input : ArticleInput) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to create articles");
    };
    if (not isWriter(caller)) {
      Runtime.trap("Unauthorized: Only writers can submit articles");
    };
    let id = nextArticleId;
    nextArticleId += 1;

    let article : Article.Article = {
      id;
      title = input.title;
      content = input.content;
      author = caller;
      category = input.category;
      publishedAt = Time.now();
      coverImageUrl = input.coverImageUrl;
      tags = input.tags;
      excerpt = input.excerpt;
      likes = Set.empty<Principal>();
      bookmarks = Set.empty<Principal>();
    };

    articles.add(id, article);
    id;
  };

  public shared ({ caller }) func updateArticle(id : Nat, input : ArticleInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to update articles");
    };
    if (not isWriter(caller)) {
      Runtime.trap("Unauthorized: Only writers can update articles");
    };
    let article = getArticleInternal(id);
    if (article.author != caller) {
      Runtime.trap("Unauthorized: You are not the author of this article");
    };

    let updatedArticle : Article.Article = {
      article with
      title = input.title;
      content = input.content;
      category = input.category;
      coverImageUrl = input.coverImageUrl;
      tags = input.tags;
      excerpt = input.excerpt;
    };

    articles.add(id, updatedArticle);
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to delete articles");
    };
    if (not isWriter(caller)) {
      Runtime.trap("Unauthorized: Only writers can delete articles");
    };
    let article = getArticleInternal(id);
    if (article.author != caller) {
      Runtime.trap("Unauthorized: You are not the author of this article");
    };
    articles.remove(id);
  };

  public query func getArticle(id : Nat) : async Article.ArticleView {
    Article.toView(getArticleInternal(id));
  };

  public query func getArticlesFromCategory(category : Article.Category) : async [Article.ArticleView] {
    filterArticles(func(article) { article.category == category }).map(Article.toView);
  };

  public query func getArticlesFromAuthor(author : Principal) : async [Article.ArticleView] {
    filterArticles(func(article) { article.author == author }).map(Article.toView);
  };

  // ========== Comments Functions ==========

  public shared ({ caller }) func postComment(articleId : Nat, content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to post comments");
    };
    ignore getArticleInternal(articleId);

    let id = nextCommentId;
    nextCommentId += 1;

    let comment : Comment = {
      id;
      articleId;
      author = caller;
      content;
      createdAt = Time.now();
    };

    comments.add(id, comment);
    id;
  };

  public query func getComment(id : Nat) : async Comment {
    switch (comments.get(id)) {
      case (null) { Runtime.trap("Comment does not exist") };
      case (?comment) { comment };
    };
  };

  public query func getCommentsForArticle(articleId : Nat) : async [Comment] {
    comments.values().toArray().filter(func(c) { c.articleId == articleId });
  };

  // ========== Likes Functions ==========

  public shared ({ caller }) func toggleLikeArticle(articleId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to like articles");
    };
    let article = getArticleInternal(articleId);

    if (article.likes.contains(caller)) {
      article.likes.remove(caller);
    } else {
      article.likes.add(caller);
    };
    let updatedArticle : Article.Article = article;
    articles.add(article.id, updatedArticle);
    not article.likes.contains(caller);
  };

  public query func getLikeCount(articleId : Nat) : async Nat {
    let article = getArticleInternal(articleId);
    article.likes.size();
  };

  public query func hasUserLikedArticle(articleId : Nat, user : Principal) : async Bool {
    let article = getArticleInternal(articleId);
    article.likes.contains(user);
  };

  // ========== Bookmark Functions ==========

  public shared ({ caller }) func toggleBookmarkArticle(articleId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to bookmark");
    };
    let article = getArticleInternal(articleId);

    if (article.bookmarks.contains(caller)) {
      article.bookmarks.remove(caller);
    } else {
      article.bookmarks.add(caller);
    };
    let updatedArticle : Article.Article = article;
    articles.add(article.id, updatedArticle);
    not article.bookmarks.contains(caller);
  };

  public query ({ caller }) func getBookmarkedArticles(user : Principal) : async [Article.ArticleView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be registered to view bookmarks");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookmarks");
    };
    filterArticles(func(article) { article.bookmarks.contains(user) }).map(Article.toView);
  };

  public query func hasUserBookmarkedArticle(articleId : Nat, user : Principal) : async Bool {
    let article = getArticleInternal(articleId);
    article.bookmarks.contains(user);
  };

  public query func getAllArticles() : async [Article.ArticleView] {
    articles.values().toArray().map(Article.toView);
  };

  public query func searchArticles(searchTerm : Text) : async [Article.ArticleView] {
    filterArticles(func(article) { article.title.contains(#text searchTerm) or article.content.contains(#text searchTerm) }).map(Article.toView);
  };
};
