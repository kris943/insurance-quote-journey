import {
  auPhone,
  email,
  integerInRange,
  oneOf,
  required,
  runValidators,
} from '../questions/validators';

describe('validators', () => {
  it('required rejects blank and whitespace-only values', () => {
    expect(required()('')).toBeDefined();
    expect(required()('   ')).toBeDefined();
    expect(required()('x')).toBeUndefined();
  });

  it.each(['name@example.com', 'first.last+tag@sub.domain.com.au'])('email accepts %s', (v) => {
    expect(email()(v)).toBeUndefined();
  });

  it.each(['name', 'name@', 'name@domain', 'a b@c.com'])('email rejects %s', (v) => {
    expect(email()(v)).toBeDefined();
  });

  it.each(['0400 000 000', '0400-000-000', '(02) 9999 9999', '+61 400 000 000', '61400000000'])(
    'auPhone accepts %s',
    (v) => expect(auPhone()(v)).toBeUndefined(),
  );

  it.each(['12345', '0100 000 000', '0400 000 0000', 'phone'])('auPhone rejects %s', (v) => {
    expect(auPhone()(v)).toBeDefined();
  });

  it('integerInRange enforces whole numbers within bounds', () => {
    const validate = integerInRange(1, 10);
    expect(validate('5')).toBeUndefined();
    expect(validate('0')).toBeDefined();
    expect(validate('11')).toBeDefined();
    expect(validate('2.5')).toBeDefined();
    expect(validate('abc')).toBeDefined();
  });

  it('oneOf restricts to allowed values', () => {
    expect(oneOf(['yes', 'no'])('yes')).toBeUndefined();
    expect(oneOf(['yes', 'no'])('maybe')).toBeDefined();
  });

  it('format validators defer blank values to required', () => {
    expect(email()('')).toBeUndefined();
    expect(runValidators([required('Required'), email()], '')).toBe('Required');
  });
});
