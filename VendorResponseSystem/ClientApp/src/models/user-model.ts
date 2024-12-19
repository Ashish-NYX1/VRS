export class UserModel {
    public constructor(userName: string, displayName: string, description: string, teamName: string, email: string){
        this.userName = userName;
        this.displayName = displayName;
        this.description = description;
        this.teamName = teamName;
        this.email = email;
    }
    userName! : string;
    displayName! : string;
    description! : string;
    teamName! : string;
    email! : string;
}
