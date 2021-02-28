import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MailerComponent } from './mailer.component';

describe('MailerComponent', () => {
  let component: MailerComponent;
  let fixture: ComponentFixture<MailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
