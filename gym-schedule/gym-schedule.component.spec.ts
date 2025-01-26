import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GymScheduleComponent } from './gym-schedule.component'; // Import komponentu

describe('GymScheduleComponent', () => {
  let component: GymScheduleComponent;
  let fixture: ComponentFixture<GymScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GymScheduleComponent], // Tylko deklaracja komponentu
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Test, czy komponent został poprawnie stworzony
  });
});
