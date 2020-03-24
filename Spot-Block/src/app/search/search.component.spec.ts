import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchComponent } from "./search.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("SearchComponent", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
