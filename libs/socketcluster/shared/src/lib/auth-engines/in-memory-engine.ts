import * as AuthEngine from 'socketcluster-client/lib/auth';

export class InMemoryEngine implements AuthEngine.AGAuthEngine {
  private _storage = new InMemoryStorage<string>();

  async saveToken(name: string, token: string): Promise<string> {
    this._storage.setItem(name, token);
    return token;
  }
  async removeToken(name: string): Promise<null> {
    this._storage.removeItem(name);
    return null;
  }
  async loadToken(name: string): Promise<string | null> {
    return this._storage.getItem(name);
  }
}

class InMemoryStorage<T> {
  private _values = new Map<string, T>();

  getItem(key: string) {
    return this._values.get(key) ?? null;
  }

  setItem(key: string, value: T) {
    this._values.set(key, value);
  }

  removeItem(key: string) {
    this._values.delete(key);
  }
}
