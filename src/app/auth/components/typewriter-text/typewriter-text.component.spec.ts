import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypewriterTextComponent } from './typewriter-text.component';

describe('TypewriterTextComponent', () => {
  let component: TypewriterTextComponent;
  let fixture: ComponentFixture<TypewriterTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypewriterTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypewriterTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
