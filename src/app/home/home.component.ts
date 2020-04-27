import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../service/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../service/promotion.service';
import { LeaderService } from '../service/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  // handling errors
  dishErrMsg: string;
  promErrMsg: string;
  leadErrMsg: string;
  
  constructor(private dishService: DishService,
              private promotionService: PromotionService,
              private leaderService: LeaderService,
              @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe(dish => this.dish = dish,
          errmsg => this.dishErrMsg = <any>errmsg);

    this.promotionService.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion,
          errmsg => this.promErrMsg = <any>errmsg);
      
    this.leaderService.getFeaturedLeader()
      .subscribe(leader => this.leader = leader,
          errmsg => this.leadErrMsg = <any>errmsg);
  }

}
