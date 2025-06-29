import { PollService } from './../poll.service';
import { Component, OnInit } from '@angular/core';
import { Poll } from './../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent implements OnInit {

  polls: Poll[] = [];

  newPoll: Poll = {
    id: null,
    question: '',
    options: [
      { voteOption: '', voteCount: 0},
      { voteOption: '', voteCount: 0}
    ]
  };

  constructor(private PollService: PollService){

  }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(){
    this.PollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
      },
      error: (error) => {
        console.error("Error fetching polls: ", error);
      }
    });
  }

  trackByIndex(index:number): number{
    return index;
  }

  createPoll(){
    this.PollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll) => {
        this.polls.push(createdPoll);
        this.resetPoll();
      },
      error: (error) => {
        console.error("Error fetching polls:", error);
      }
    });
  }

  resetPoll(){
    this.newPoll={
      id:null,
      question:'',
      options:[
        {voteOption: '', voteCount:0},
        {voteOption: '', voteCount:0},
      ]
    }
  }

  addAnotherPoll(){
    this.newPoll.options.push({ voteOption: '', voteCount: 0});
  }

  vote(pollId:number|null, voteOption:number){
    this.PollService.vote(pollId, voteOption).subscribe({
      next:()=>{
        const poll=this.polls.find(p=>p.id===pollId);
        if(poll){
          poll.options[voteOption].voteCount++;
        }
      },
      error:(error)=>{
        console.error("Error while placing a vote", error);
      }
    })
  }
}
