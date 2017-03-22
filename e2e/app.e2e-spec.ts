import { MuniTribuPage } from './app.po';

describe('muni-tribu App', () => {
  let page: MuniTribuPage;

  beforeEach(() => {
    page = new MuniTribuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
