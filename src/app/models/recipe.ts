
export class Recipe{
    id?: number;
    name: string;
    description: string;
    dateCreated: string;
    constructor(name: string, description: string,dateCreated: string){
        this.name = name;
        this.description = description;
        this.dateCreated = dateCreated;
    }
}