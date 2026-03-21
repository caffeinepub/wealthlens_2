import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";

module {
  type OldArticle = {
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

  type Category = {
    #stock;
    #crypto;
    #property;
    #finance;
    #economicHistory;
  };

  type Role = {
    #writer;
    #reader;
  };

  type NewArticle = {
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

  type OldComment = {
    id : Nat;
    articleId : Nat;
    author : Principal;
    content : Text;
    createdAt : Time.Time;
  };

  type OldActor = {
    articles : Map.Map<Nat, OldArticle>;
    comments : Map.Map<Nat, OldComment>;
    userProfiles : Map.Map<Principal, { name : Text; role : Role }>;
    nextArticleId : Nat;
    nextCommentId : Nat;
  };

  type NewActor = {
    articles : Map.Map<Nat, NewArticle>;
    comments : Map.Map<Nat, OldComment>;
    userProfiles : Map.Map<Principal, { name : Text; bio : Text; photoUrl : Text; role : Role }>;
    nextArticleId : Nat;
    nextCommentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, { name : Text; role : Role }, { name : Text; bio : Text; photoUrl : Text; role : Role }>(
      func(_p, oldProfile) { { oldProfile with bio = ""; photoUrl = "" } }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
