import { Test, TestingModule } from '@nestjs/testing';
import { SigningKeyGenerator } from './key.generator';
import { pki } from 'node-forge';

describe('KeyGenerator', () => {
  let signingKeyGenerator: SigningKeyGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SigningKeyGenerator
      ],
    }).compile();

    signingKeyGenerator = module.get(SigningKeyGenerator);
  });

  it('generate', async () => {
    const tenant = {
      name: 'foo'
    };

    const attrs = [
      { name: 'commonName', value: tenant.name },
      { name:'countryName', value: 'zh' },
      { shortName: 'ST', value: tenant.name },
      { name:'localityName', value: 'shenzhen' },
      { name:'organizationName', value: tenant.name },
    ];

    const key = await signingKeyGenerator.generateSigningKey('RS256', attrs);
    console.log('key: ', key);

    const crt = pki.certificateFromPem(key.cert);
    console.log('crt cert: ', crt);
  });
});
