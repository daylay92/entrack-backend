import { expect } from 'chai';
import client from '../database';

describe('Basic Utility Functions', () => {
  it('should create a key-value record in redis database', async () => {
    const value = 'All seem well';
    await client.setAsync('test', value);
    const res = await client.getAsync('test');
    expect(res).to.eql(value);
  });
});
