import { CountryLowercasePipe } from './country-lowercase.pipe';

describe('CountryLowercasePipe', () => {
  it('create an instance', () => {
    const pipe = new CountryLowercasePipe();
    expect(pipe).toBeTruthy();
  });
  it('return lowercase', () => {
    const pipe = new CountryLowercasePipe();
    const result = pipe.transform('en-GB');

    expect(result).toBe('gb');

    const second = pipe.transform('es-ES');
    expect(second).toBe('es');
  });
});
