import { Logger } from '@nestjs/common';
import * as jose from 'jose';
import { pki, md, asn1 } from 'node-forge';

export class SigningKeyGenerator {
  async generateSigningKey(alg: string, attrs: Record<string, any>): Promise<any> {
    const { privateKey, publicKey } = await jose.generateKeyPair(alg);
    console.log('publicKey: ', publicKey);

    const pubJWK = await jose.exportJWK(publicKey);
    const priJWK = await jose.exportJWK(privateKey);
    const thumbprint = await jose.calculateJwkThumbprint(pubJWK);
    console.log('pubJWK: ', pubJWK);

    Logger.log('thumbprint: ' + thumbprint);

    const pkcs8 = await jose.exportPKCS8(privateKey);
    Logger.log('pkcs8: ' + pkcs8);

    const spki = await jose.exportSPKI(publicKey); // PEM-encoded SPKI string format
    console.log('spki: ' + spki);

    // const forgePubKey = this.convertJoseKeyToForgeKey(pubJWK);
    // const forgePriKey = await this.convertJoseKeyToForgeKey(priJWK);
    const forgePriKey = pki.privateKeyFromPem(pkcs8);
    const forgePubKey = pki.publicKeyFromPem(spki);
    var cert = pki.createCertificate();
    cert.publicKey = forgePubKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(forgePriKey);
    // console.log('pem_pkey: ', pem_pkey);
    const pem_cert = pki.certificateToPem(cert);
    console.log('pem_cert', pem_cert);

    const fingerprint = pki.getPublicKeyFingerprint(forgePubKey, {
      md: md.md5.create(),
      encoding: 'hex',
      delimiter: ':'
    });

    return {
      pkcs8,
      spki,
      cert: pem_cert, // '-----BEGIN CERTIFICATE-----\r\nMIIDCTCCAfGgAwIBAgIJQWVs0ckOAIdNMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV\r\nBAMTF2dyb3dpbmdib3gudXMuYXV0aDAuY29tMB4XDTIwMTAxMjExMjYwOVoXDTM0\r\nMDYyMTExMjYwOVowIjEgMB4GA1UEAxMXZ3Jvd2luZ2JveC51cy5hdXRoMC5jb20w\r\nggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCcP5neNXKY9Np5GQZdTETJ\r\nZ6GipypRxhDHQHTl0TXAHvAJub8n/uu5ePWsJJyR0v1Dxm5Hn97EUEKAwzc6KomB\r\ntHZF8Ipba5wNWixRwTgWPTy3B/QEuEkBzGFnZYTA/BDjetJLyHtKhGLEvsdpIaKQ\r\ntblhl+s4fJoNxWBMgo0Xls5I2Yx65uLzWwc54bmQGssm5zYOb4sOFgUOp1HFkcG6\r\nzyMJXqZ6qcl8AG7HN531Tu934j81+tnW2VspZw7G0v/R/FNDAQjmxD0wRPt6+WHS\r\nF3icehCAsxVQh0JU0jYJg/QMWX4x5BuZXOllUfJHMUIKU35+vIJTf3Gk2FNwPxTZ\r\nAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFBASG85oDmWgUUoV\r\nOo6xzTw1fiAAMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEASEfp\r\nUB/B77+1r9PzVs9RkSqGaRzpnVbbFQXxWFYJtZmC+9L4bMe1oH1ZkYmKqlKd04Ck\r\nnaYT7JY6OA9p7HxrE78Rz2hZJXYZIARpsXBZM8ZL7DYRCaqO5C8G2lz7Wr+zep0W\r\nK87D5GNrXTGB9Aak6oI3DL3hVxs2kiQTRZScL+7TrsJ1qevs9LzorTMR4QKDxVyn\r\nspEJegfKn1Exjn97QKNI+GbNnS5GsUspGAYunuavrqLtYA1+C3wR1wArYoUuwGwA\r\nCZM9HCWg0MB2RI/0q6N4aWoaPKxDZ09pDBGETNz/lcrhcnxAybqWTxjdVhPJmyFt\r\nVCKaBqPkHjCZOhv3RQ==\r\n-----END CERTIFICATE-----',
      pkcs7:
        '-----BEGIN PKCS7-----\r\nMIIDOAYJKoZIhvcNAQcCoIIDKTCCAyUCAQExADALBgkqhkiG9w0BBwGgggMNMIID\r\nCTCCAfGgAwIBAgIJQWVs0ckOAIdNMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNVBAMT\r\nF2dyb3dpbmdib3gudXMuYXV0aDAuY29tMB4XDTIwMTAxMjExMjYwOVoXDTM0MDYy\r\nMTExMjYwOVowIjEgMB4GA1UEAxMXZ3Jvd2luZ2JveC51cy5hdXRoMC5jb20wggEi\r\nMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCcP5neNXKY9Np5GQZdTETJZ6Gi\r\npypRxhDHQHTl0TXAHvAJub8n/uu5ePWsJJyR0v1Dxm5Hn97EUEKAwzc6KomBtHZF\r\n8Ipba5wNWixRwTgWPTy3B/QEuEkBzGFnZYTA/BDjetJLyHtKhGLEvsdpIaKQtblh\r\nl+s4fJoNxWBMgo0Xls5I2Yx65uLzWwc54bmQGssm5zYOb4sOFgUOp1HFkcG6zyMJ\r\nXqZ6qcl8AG7HN531Tu934j81+tnW2VspZw7G0v/R/FNDAQjmxD0wRPt6+WHSF3ic\r\nehCAsxVQh0JU0jYJg/QMWX4x5BuZXOllUfJHMUIKU35+vIJTf3Gk2FNwPxTZAgMB\r\nAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFBASG85oDmWgUUoVOo6x\r\nzTw1fiAAMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEASEfpUB/B\r\n77+1r9PzVs9RkSqGaRzpnVbbFQXxWFYJtZmC+9L4bMe1oH1ZkYmKqlKd04CknaYT\r\n7JY6OA9p7HxrE78Rz2hZJXYZIARpsXBZM8ZL7DYRCaqO5C8G2lz7Wr+zep0WK87D\r\n5GNrXTGB9Aak6oI3DL3hVxs2kiQTRZScL+7TrsJ1qevs9LzorTMR4QKDxVynspEJ\r\negfKn1Exjn97QKNI+GbNnS5GsUspGAYunuavrqLtYA1+C3wR1wArYoUuwGwACZM9\r\nHCWg0MB2RI/0q6N4aWoaPKxDZ09pDBGETNz/lcrhcnxAybqWTxjdVhPJmyFtVCKa\r\nBqPkHjCZOhv3RTEA\r\n-----END PKCS7-----\r\n',
      fingerprint,
      thumbprint,
    };
  }
}
