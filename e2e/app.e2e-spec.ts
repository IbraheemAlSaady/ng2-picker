import { Angular2DateTimePickerPage } from './app.po';

describe('angular2-date-time-picker App', function() {
  let page: Angular2DateTimePickerPage;

  beforeEach(() => {
    page = new Angular2DateTimePickerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
