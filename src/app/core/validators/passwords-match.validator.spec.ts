import { FormBuilder } from '@angular/forms';
import { passwordsMatchValidator } from './passwords-match.validator';

describe('passwordsMatchValidator', () => {
  const fb = new FormBuilder();

  it('has no error when both fields are empty', () => {
    const form = fb.group(
      { newPassword: [''], confirmPassword: [''] },
      { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
    );
    expect(form.errors).toBeNull();
  });

  it('has no error when both fields match', () => {
    const form = fb.group(
      { newPassword: ['secret123'], confirmPassword: ['secret123'] },
      { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
    );
    expect(form.errors).toBeNull();
  });

  it('has a passwordsMismatch error when the fields differ', () => {
    const form = fb.group(
      { newPassword: ['secret123'], confirmPassword: ['other456'] },
      { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
    );
    expect(form.errors).toEqual({ passwordsMismatch: true });
  });
});
