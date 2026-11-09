import type { TMessageAudio } from '~/common';
import { BrowserTTS, ExternalTTS } from '../TTS';
import { render } from 'test/layout-test-utils';

const message: TMessageAudio = {
  isLast: false,
  index: 0,
  messageId: 'msg-1',
  content: 'Hello',
};

const engines = [
  ['browser', BrowserTTS],
  ['external', ExternalTTS],
] as const;

describe('message audio source', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: () => undefined,
    });
  });

  it.each(engines)('%s TTS omits src until a real audio URL exists', (_engine, Component) => {
    const view = render(<Component {...message} />);
    view.rerender(<Component {...message} />);

    const audio = view.container.querySelector('audio');
    if (!(audio instanceof HTMLAudioElement)) {
      throw new Error('Expected an audio element');
    }

    expect(audio.getAttribute('src')).toBeNull();

    const source = 'https://cdn.example.com/speech.mp3';
    audio.src = source;
    view.rerender(<Component {...message} />);
    expect(audio.getAttribute('src')).toBe(source);
  });
});
