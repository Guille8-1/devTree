export type User = {
    handle:string
    name: string
    email: string
    password: string,
    description: string
    image:string
    links:string
}

export type RegisterForm = Pick<User, "handle"| "email" | "name"> &{
    password:string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password:string
}

export type profileForm = Pick<User, 'handle' | 'description'>

export type SocialNetwork = {
    id:number;
    name:string,
    url:string,
    enabled:boolean,
    link:string
}

export type DevTree = Pick<SocialNetwork, 'name'|'url'|'enabled'>