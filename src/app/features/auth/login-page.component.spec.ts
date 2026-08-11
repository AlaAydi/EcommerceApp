import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'register', 'currentUser']);
    authService.currentUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['warning']) },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
  });

  it('should redirect a client registration to the login page', async () => {
    component.mode = 'register';
    component.name = 'Client Test';
    component.email = 'client@test.com';
    component.password = '12345678';
    authService.register.and.resolveTo(true);
    authService.currentUser.and.returnValue({ role: 'client', uid: 'u1', email: 'client@test.com', displayName: 'Client Test', createdAt: new Date().toISOString(), photoURL: '', address: undefined, phone: undefined } as any);

    await component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should redirect logged-in client to the return url', async () => {
    component.mode = 'login';
    component.email = 'client@test.com';
    component.password = '12345678';
    authService.login.and.resolveTo(true);
    authService.currentUser.and.returnValue({ role: 'client', uid: 'u1', email: 'client@test.com', displayName: 'Client Test', createdAt: new Date().toISOString(), photoURL: '', address: undefined, phone: undefined } as any);

    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').withArgs('returnUrl').and.returnValue('/shop');

    await component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/shop');
  });
});
