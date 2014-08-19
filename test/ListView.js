var assert      = require('assert');
var ListView    = require('autosuggest/lib/ListView.js');
var View        = require('js-view');
var list;

function createList() {
  return new ListView();
}

function populateList(list) {
  for (var i=0; i<5; ++i) {
    list.prepend(new View({ el: { tag: 'div', content: 'View #'+i } }));
  }
  return list;
}

describe('ListView', function() {

  beforeEach(function() {
    list = createList();
  });

  describe('.getSelectedIndex()', function() {

    beforeEach(function() {
      list = populateList(createList());
    });

    it('should be null', function() {
      assert.equal(null, list.getSelectedIndex());
    });

    it('should not be null and have class', function() {
      list.selectIndex(0);
      assert.notEqual(null, list.getSelectedIndex());
      assert(list.at(list.getSelectedIndex()).el.classList.contains('is-selected'));
    });

  });

  describe('.hasPrevious() and .hasNext()', function() {

    beforeEach(function() {
      list = populateList(createList());
    });

    it('should be false when nothing is selected', function() {
      assert(!list.hasPrevious());
      assert(!list.hasNext());
    });

    it('should be true when something in da middle is selected', function() {
      list.selectIndex(2);
      assert(list.hasPrevious());
      assert(list.hasNext());
    });

    it('at the start', function() {
      list.selectIndex(0);
      assert(!list.hasPrevious());
      assert(list.hasNext());
    });

    it('at the end', function() {
      list.selectIndex(list.count()-1);
      assert(list.hasPrevious());
      assert(!list.hasNext());
    });

  });

  describe('.selectPrevious()', function() {

    beforeEach(function() {
      list = populateList(createList());
    });

    it('should select the previous view', function() {

      list.selectIndex(1);
      assert.equal(1, list.getSelectedIndex());

      list.selectPrevious();
      assert.equal(0, list.getSelectedIndex());

    });

    it('should not select the previous view past the start of the list', function() {
      assert.throws(function() {

        list.selectIndex(0);
        assert.equal(0, list.getSelectedIndex());

        list.selectPrevious();

      }, Error);
    });

  });

  describe('.selectNext()', function() {

    beforeEach(function() {
      list = populateList(createList());
    });

    it('should select the next view', function() {

      list.selectIndex(0);
      assert.equal(0, list.getSelectedIndex());

      list.selectNext();
      assert.equal(1, list.getSelectedIndex());

    });

    it('should not select the next view past the end of the list', function() {
      assert.throws(function() {

        list.selectIndex(list.count()-1);
        assert.equal(list.count()-1, list.getSelectedIndex());

        list.selectNext();

      }, Error);
    });

  });

  describe('.prepend()', function() {

    it('should not change the selected index', function() {

      assert.equal(0, list.count());
      assert.equal(null, list.getSelectedIndex());

      list.prepend(new View({ el: { content: 'test' } }));

      assert.equal(1, list.count());
      assert.equal(null, list.getSelectedIndex());

    });

    it('should change the selected index', function() {

      assert.equal(0, list.count());
      assert.equal(null, list.getSelectedIndex());

      list.prepend(new View({ el: { content: 'View #1' } }));

      assert.equal(1, list.count());
      assert.equal(null, list.getSelectedIndex());

      list.selectIndex(0);

      assert.equal(1, list.count());
      assert.equal(0, list.getSelectedIndex());

      list.prepend(new View({ el: { content: 'View #2' } }));

      assert.equal(2, list.count());
      assert.equal(1, list.getSelectedIndex());

    });

  });

  describe('.append()', function() {

    it('should never change the selected index', function() {

      assert.equal(0, list.count());
      assert.equal(null, list.getSelectedIndex());

      list.append(new View({ el: { content: 'View #1' } }));

      assert.equal(1, list.count());
      assert.equal(null, list.getSelectedIndex());

      list.selectIndex(0);

      assert.equal(1, list.count());
      assert.equal(0, list.getSelectedIndex());

      list.append(new View({ el: { content: 'View #2' } }));

      assert.equal(2, list.count());
      assert.equal(0, list.getSelectedIndex());

    });

  });

  describe('.remove()', function() {

    beforeEach(function () {
      list = populateList(createList());
    });

    it('should reset the index', function () {

      list.selectIndex(2);
      list.remove(list.at(2));

      assert.equal(null, list.getSelectedIndex());

    });

  });

  describe('.removeAll()', function() {

    beforeEach(function () {
      list = populateList(createList());
    });

    it('should reset the index', function () {

      list.removeAll();
      assert.equal(0, list.count());
      assert.equal(null, list.getSelectedIndex());
      assert.equal(0, list.el.children.length);

    });

  });

});