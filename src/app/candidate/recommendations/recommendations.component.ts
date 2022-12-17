import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { Globals } from 'src/app/globals';
@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})

export class RecommendationsComponent implements OnInit {
  @ViewChildren(RecommendationComponent) recommendations !: QueryList<RecommendationComponent>;
  nrecommendations = 0;
  recommendationsSaved = 0;

  constructor(public globals: Globals) { }

  ngOnInit(): void {
    this.recommendationsSaved = this.globals.candidate?.recommendations.length;
    this.nrecommendations = this.recommendationsSaved;
  }

  updateCount(event: any) {
    if (event) {
      this.recommendationsSaved = this.globals.candidate?.recommendations.length;
    }
  }

  recommendationArray(n: number): any[] {
    return Array(n);
  }

  recommenderName(index: any) {
    const reco = this.globals.candidate?.findRecommendation(Number(index));
    return (reco) ? reco.full_name : '';
  }

  addRecommendation() {
    if (this.nrecommendations === this.recommendationsSaved) {
      this.nrecommendations = this.recommendationsSaved + 1;
    }
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    let savingNotRequired = true;
    this.recommendations.forEach((reco) => {
      if (!reco.nothingToSave()) { savingNotRequired = false; }
    });
    return savingNotRequired;
  }
}
