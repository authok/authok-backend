export class Mail {
  _from: string;
  _to: string;
  _subject: string;
  _text?: string;
  _html?: string;

  from(val: string): Mail {
    this._from = val;
    return this;
  }

  to(val: string): Mail {
    this._to = val;
    return this;
  }

  subject(val: string): Mail {
    this._subject = val;
    return this;
  }

  text(val: string): Mail {
    this._text = val;
    return this;
  }

  html(val: string): Mail {
    this._html = val;
    return this;
  }
}
