import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../service/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

  // dishes
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  // comment form
  commentForm: FormGroup;
  commentt: Comment
  @ViewChild('cform',{static:false}) commentFormDirective;

  commentErrors = {
    'author': '',
    'comment': ''
  };

  validComment = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Author name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 2 characters long.'
    },
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit() {
    this.createForm();

    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
      .pipe(switchMap((params:Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      date: ''
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data))

      this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) {return;}
    const form = this.commentForm;

    for(const field in this.commentErrors){
      if(this.commentErrors.hasOwnProperty(field)){
        //clear prev error message
        this.commentErrors[field] = '';
        const control = form.get(field);

        if(control && control.dirty && !control.valid){
          const messages = this.validComment[field];

          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.commentErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.commentt = this.commentForm.value;
    console.log(this.commentt);

    this.dish.comments.push({
      rating: this.commentt.rating,
      comment: this.commentt.comment,
      author: this.commentt.author,
      date: Date.now().toString()
    });


    this.commentForm.reset({
      comment: '',
      author: '',
      date: ''
    });
    this.commentFormDirective.resetForm({rating:5});
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
}
