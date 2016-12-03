import { NykreditFoosballOrganizerPage } from './app.po';

describe('nykredit-foosball-organizer App', function() {
  let page: NykreditFoosballOrganizerPage;

  beforeEach(() => {
    page = new NykreditFoosballOrganizerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
