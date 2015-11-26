Tinytest.add('Describe - Execution Flow', function(test) {
  // Mocking Tinytest.add
  let texts = [];
  const _add = Tinytest.add;
  const _addAsync = Tinytest.addAsync;
  Tinytest.add = function(text, fn) {
    texts.push(text);
    fn();
  };
  Tinytest.addAsync = function(text, fn) {
    texts.push(text);
    let test = {};
    let done = () => {
    };
    fn(test, done);
  };

  let str = '';
  describe('Step1', function() {
    str += 'a';
    context('When running description', function() {
      str += 'b';
      before(function() {
        str += '[';
      });

      beforeEach(function() {
        str += '(';
      });

      afterEach(function() {
        str += ')';
      });

      after(function() {
        str += ']';
      });

      it('should do this', function() {
        str += 'c'
      });

      it('should do this too', function() {
        str += 'd'
      });
    });

    context('When running other description', function() {
      str += ',e';
      it('should run at the end', function() {
        str += 'f';
      });
    });

    context('When running async', function() {
      str += ',g';
      it('should run async', (done) => {
        str += 'h';
        Meteor.setTimeout(function() {
          done();
        }, 1);
      });
    });
  });
  Tinytest.add = _add;
  Tinytest.addAsync = _addAsync;

  test.equal('ab[(c)(d)],ef,gh', str);
  test.equal('Step1 - When running description - before', texts[0]);
  test.equal('Step1 - When running description - beforeEach (should do this)', texts[1]);
  test.equal('Step1 - When running description - should do this', texts[2]);
  test.equal('Step1 - When running description - afterEach (should do this)', texts[3]);
  test.equal('Step1 - When running description - beforeEach (should do this too)', texts[4]);
  test.equal('Step1 - When running description - should do this too', texts[5]);
  test.equal('Step1 - When running description - afterEach (should do this too)', texts[6]);
  test.equal('Step1 - When running description - after', texts[7]);
  test.equal('Step1 - When running other description - should run at the end', texts[8]);
  test.equal('Step1 - When running async - should run async', texts[9]);
});

describe('Real test execution', function() {
  context('Sync test', function() {
    it('should be true', function() {
      expect(1, 'should be 1').to.equal(1);
    });
  });

  context('Async test', function() {

    before(function(done) {
      Meteor.setTimeout(() => {
        done();
      }, 1);
    });

    it('should be true', function(done) {
      Meteor.setTimeout(() => {
        catchable(done, () => {
          expect(1).to.equal(1);
          done();
        });
      }, 1);
    });
  });
});

describe('Promises', function() {
  context('Async tests using promises', function() {

    let isOne = function(param, cb) {
      if (param === 1) {
        cb(null, true);
      } else {
        cb('not one');
      }
    };

    it('should pass when promise succeeds', function(done) {
      promisify(isOne, 1).then(function(r) {
        expect(r).to.equal(true);
        done();
      });
    });

    it('should allow us to catch errors', function(done) {
      promisify(isOne, 0).then(function(r) {
        expect(r).to.be.undefined;
        done();
      }).catch(function(e) {
        expect(e).to.equal('not one');
        done();
      });
    });
  });
});
