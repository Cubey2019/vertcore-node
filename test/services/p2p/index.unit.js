'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var P2PService = require('../../../lib/services/p2p');
var Inventory = require('bitcore-p2p').Inventory;

describe('P2P Service', function() {
  var p2p;
  var testEmitter;
  
  before(function(done) {
    p2p = new P2PService({
      node: {
        name: 'p2p',
        on: sinon.stub()
      }
    });
    sinon.stub(p2p, '_initPool');
    p2p._pool = new EventEmitter();
    done();
  });

  it('should get the mempool from the network', function() {
    var sendMessage = sinon.stub();
    var peer = { sendMessage: sendMessage };
    var getPeer = sinon.stub(p2p, '_getPeer').returns(peer);
    p2p.getMempool();
    expect(getPeer.calledOnce).to.be.true;
    expect(sendMessage.calledOnce).to.be.true;
  });

  it('should request witness blocks', function() {    var sendMessage = sinon.stub();
    var sendMessage = sinon.stub();
    var peer = { sendMessage: sendMessage };
    var invMessage = {
      inventory: [
        { hash: '0123456789abcdef1', type: Inventory.TYPE.BLOCK },
        { hash: '0123456789abcdef2', type: Inventory.TYPE.TX },
        { hash: '0123456789abcdef3', type: Inventory.TYPE.FILTERED_BLOCK },
        { hash: '0123456789abcdef4', type: Inventory.TYPE.CMPCT_BLOCK }
      ]
    }
    p2p._initCache();
    p2p._onPeerInventory(peer, invMessage);
    expect(sendMessage.calledOnce).to.be.true;
    expect(sendMessage.getCall(0).args.length).to.equal(1);
    expect(sendMessage.getCall(0).args[0].inventory).to.deep.equal([
      { hash: '0123456789abcdef1', type: Inventory.TYPE.WITNESS_BLOCK },
      { hash: '0123456789abcdef2', type: Inventory.TYPE.WITNESS_TX },
      { hash: '0123456789abcdef3', type: Inventory.TYPE.FILTERED_WITNESS_BLOCK },
      { hash: '0123456789abcdef4', type: Inventory.TYPE.CMPCT_BLOCK }
    ]);
  });
});

