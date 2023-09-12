import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ingredient } from 'src/app/models/ingredient';
import { IngredientTypes } from 'src/app/models/ingredient-types';
import { Recipe } from 'src/app/models/recipe';
import { RecipeDetails } from 'src/app/models/recipeDetails';
import { RecipeDetailsService } from 'src/app/services/recipe-details.service';
import { RecipeDifficultyService } from 'src/app/services/recipe-difficulty.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {

  showRecipeForm = true;
  showRecipeDetailsForm = false;
  showRecipeIngredientForm = false;
  dataRecipe: FormGroup;
  recipeID: number;
  recipe: Recipe;
  nameRecipe: string;
  descriptionRecipe: string;
  preparationRecipe: string;
  recipeDetails: FormGroup;
  difficultySelect: FormGroup;
  recipeIngredients: FormGroupName;
  // pasos
  recipeSteps: FormGroupName;

  // 
  listIngredientTypes: IngredientTypes[] = []
  ingredientTypesNames: any[] = []
  recipeStepsList: any[] = []
  recipeDifficulties: any[] = []

  constructor(private fb: FormBuilder,
    private router: Router,
    private recipeService: RecipeService,
    private recipeDetailsService: RecipeDetailsService,
    private recipeDifficultyService: RecipeDifficultyService,
    private toast: ToastrService) {
    this.dataRecipe = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateCreated: ['']
    })

    this.recipeDetails = this.fb.group({
      preparationTime: ['', [Validators.required]],
      servings: ['', [Validators.required]],
      difficulty: ['', [Validators.required]],
      id: [''],
      recipeIngredients: fb.group({
        ingredientsList: this.fb.array([
          this.addIngredientsFormGroup()
        ])
      }),
      recipeSteps: fb.group({
        stepsList: this.fb.array([
          this.addStepsFormGroup()
        ])
      })
    })
    this.difficultySelect = this.fb.group({
      difficulty: ['']
    });
  }

  ngOnInit(): void {
    this.getRecipeDifficulty()
  }

  public addIngredientsFormGroup(): FormGroup {
    return this.fb.group({
      ingredientName: ['']
    })
  }
  public addStepsFormGroup(): FormGroup {
    return this.fb.group({
      recipeStep: [''],
      recipeStepOrden: ['']
    })
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('-')
    );
  }
  getRecipeDifficulty() {
    this.recipeDifficultyService.getRecipeDifficulties().subscribe(data => {
      this.difficultySelect.controls['difficulty'].setValue(data[0]['difficulty'])
      this.recipeDifficulties = data;
      console.log("rd", data);
    })
  }
  registerRecipe() {
    const now = new Date();
    const newRecipe: Recipe = {
      name: this.dataRecipe.value.name,
      description: this.dataRecipe.value.description,
      dateCreated: this.formatDate(now)
    }
    this.recipe = newRecipe;
    this.showRecipeForm = false; this.showRecipeDetailsForm = true
    // this.recipeService.saveRecipe(recipe).subscribe(data => {
    //   this.recipeID = data.message;
    //   this.showRecipeForm = false; this.showRecipeDetailsForm = true
    // }, error => { this.toast.error('Hubo un error al continuar, intente más tarde', 'Error') })
  }

  get getIngredients(): FormArray { return <FormArray>this.recipeDetails.get('recipeIngredients.ingredientsList') }
  get getSteps(): FormArray { return <FormArray>this.recipeDetails.get('recipeSteps.stepsList') }

  addIngredient(): void {
    this.getIngredients.push(this.addIngredientsFormGroup())
    this.ingredientTypesNames = []
    this.getIngredients.value.forEach((element, index) => {
      const i = {
        "ingredient": element.ingredientName
      }
      this.ingredientTypesNames.push(i)
    })
    this.ingredientTypesNames.pop()
    //this.recipeDetails.get('recipeIngredients.ingredientNameType').reset()
  }
  addStep(): void {
    this.getSteps.push(this.addStepsFormGroup())
    console.log(this.getSteps)
    this.recipeStepsList = []
    this.getSteps.value.forEach((element, index) => {
      const s = {
        "stepDescription": element['recipeStep'],
      }
      console.log(s)
      this.recipeStepsList.push(s)
    })
    this.recipeStepsList.pop()
    //this.recipeDetails.get('recipeSteps.stepsList').reset()
  }
  reset(): void {
    this.getIngredients.clear()
    this.recipeDetails.get('recipeIngredients.ingredientNameType').reset()
    this.addIngredient()
  }

  addIngredientTypeList(): void {
    const ingredientType = this.recipeDetails.get('recipeIngredients.ingredientNameType').value
    const ingredientArray = this.recipeDetails.get('recipeIngredients.ingredientsList').value;
    const ingArray: Ingredient[] = []

    ingredientArray.forEach((element, index) => {
      const ingredient: Ingredient = new Ingredient(element.ingredientName)
      ingArray.push(ingredient);

    })

    const ingredientTypes: IngredientTypes = new IngredientTypes(ingredientType, ingArray)
    this.listIngredientTypes.push(ingredientTypes)
    this.ingredientTypesNames.push(ingredientTypes.name)
    this.reset()
  }

  changePublicationStatus(): void { this.recipeService.ChangePublicationStatus(this.recipeID).subscribe() }

  registerRecipeDetails(): void {
    console.log(this.recipe)
    const recipeDetails: RecipeDetails = {
      preparationTime: this.recipeDetails.value.preparationTime,
      servings: this.recipeDetails.value.servings,
      difficulty: this.difficultySelect.value['difficulty'],
      recipeId: this.recipeID,
    }
    console.log(recipeDetails)
    console.log(this.recipeStepsList)
    console.log(this.ingredientTypesNames)



    const body = {
      "difficultyId": recipeDetails.difficulty,
      "diners": recipeDetails.servings,
      "ingredientsList": this.ingredientTypesNames,
      "preparationTime": recipeDetails.preparationTime,
      "recipeDescription": this.recipe.description,
      "recipeName": this.recipe.name,
      "recipeStepsList": this.recipeStepsList,
      "userId": 1
    }
    console.log(body)

    this.recipeService.saveRecipe(body).subscribe(data => {
      console.log('dataaa  ', data)
      //this.changePublicationStatus()
      this.toast.success('Receta publicada exitosamente', '')
      this.router.navigate(['/recipes'])
    }, error => { this.toast.error('Hubo un error al subir la receta, intente más tarde', 'Error') })
  }

}