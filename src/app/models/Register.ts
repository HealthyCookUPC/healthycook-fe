export interface Register {
  id:            number;
  username: string;
  firstname: string;
  lastname: string;
  email:string;
  password:string;
  imageURL:string;
  dateCreated:string;
}

export interface ResponseRegister {
  id:number;
}
