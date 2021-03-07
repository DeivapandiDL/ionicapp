import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mailer',
  templateUrl: './mailer.component.html',
  styleUrls: ['./mailer.component.scss'],
})
export class MailerComponent implements OnInit {

  simpleDrop:any=null;
  items:any[];
  droppedValue:number;
  grid:any[];
  droppedItems:any[];


  constructor() {
    this.items=[
      {id:1,title:"Title",text:"Add Title Here",style:{},textEdit:false},
      {id:2,title:"Image",text:"",style:{},imgStyle:{},hyperLink:''},
      {id:3,title:"Button",text:"Button",style:{},hyperLink:''},
      {id:4,title:"Social",text:"",style:{},hyperLink:''},
      {id:5,title:"Desc",text:"Enter Your Description",style:{},textEdit:false},
    ];
    this.grid=[
      {row:[{col:1,style:{}}]},
      {row:[{col:1,style:{}},{col:2,style:{}}]},
      {row:[{col:1,style:{}},{col:2,style:{}},{col:3,style:{}}]},
    ];
    this.droppedItems=[];
   }
   ckeConfig:any;
   mycontent:string;
   
  ngOnInit() {
    this.ckeConfig={
      allowedContent:false,
      forcePasteAsPlainText:true,
      font_names:'Arial;Times New Roman;Verdana',
      toolbarGroups:[
        {name:'clipboard',groups:['clipboard','undo']},
        {name:'editing',groups:['find','selection','spellchecker','editing']},
        {name:'forms',groups:['forms']},
        '/',
        {name:'basicstyles',groups:['basicstyles','cleanup']},
        {name:'paragraph',groups:['list','indent','blocks','align','bidi','paragraph']},
        {name:'links',groups:['links']},
        {name:'insert',groups:['insert']},
      ],
      removeButtons:'Source,Save,NewPage,Preview,Print,Templates,Cut, Copy, Paste, PasteText, PasteFrom'
    }
  }

}
