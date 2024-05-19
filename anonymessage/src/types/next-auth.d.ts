        import "next-auth"

declare module "next-auth"{
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string; 
        }& DefaultSession['user']
    }
}

declare module "next-auth/jwt"{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;   
    }
}

git config --global user.email "prafulcoc1@gmail.com"
git config --global user.name "26-pm"