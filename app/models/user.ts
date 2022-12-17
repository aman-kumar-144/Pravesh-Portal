export class PraveshUser {
    //  The User Model and attributes
    pk !: number;
    email !: string;
    password !: string;
    first_name !: string;
    last_name !: string;
    short_name !: string;
    gender !: string;
    title !: string;
    temp_password !: boolean;
    is_candidate !: boolean;
    is_faculty !: boolean;
    is_office !: boolean;
    is_active !: boolean;
    is_staff !: boolean;
    is_superuser !: boolean;
}

export class Credentials {
    //  JWT Token from the Server
    token !: string;
    //  User Model for a Pravesh User
    user !: PraveshUser;
}