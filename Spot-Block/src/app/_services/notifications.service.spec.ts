import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { NotificationsService } from "./notifications.service";

describe("NotificationsService", () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule]
    });
    service = TestBed.inject(NotificationsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
