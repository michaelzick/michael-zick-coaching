import { updateLessonProgress } from '@/lib/api/progress';

type XapiStatement = {
  actor: { mbox: string; name: string };
  verb: { id: string; display: Record<string, string> };
  object: { id: string; definition?: { name?: Record<string, string> } };
  result?: { completion?: boolean; duration?: string; score?: { scaled?: number } };
  timestamp: string;
};

const VERBS = {
  initialized: 'http://adlnet.gov/expapi/verbs/initialized',
  progressed: 'http://adlnet.gov/expapi/verbs/progressed',
  completed: 'http://adlnet.gov/expapi/verbs/completed',
} as const;

export class XapiTracker {
  private endpoint: string;
  private activityId: string;
  private lessonId: string;
  private actorEmail: string;
  private actorName: string;

  constructor(config: {
    endpoint: string;
    activityId: string;
    lessonId: string;
    actorEmail: string;
    actorName: string;
  }) {
    this.endpoint = config.endpoint;
    this.activityId = config.activityId;
    this.lessonId = config.lessonId;
    this.actorEmail = config.actorEmail;
    this.actorName = config.actorName;
  }

  private buildStatement(verbId: string, verbDisplay: string, result?: XapiStatement['result']): XapiStatement {
    return {
      actor: { mbox: `mailto:${this.actorEmail}`, name: this.actorName },
      verb: { id: verbId, display: { 'en-US': verbDisplay } },
      object: { id: this.activityId },
      result,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendStatement(statement: XapiStatement) {
    // Send to external LRS if configured
    if (this.endpoint) {
      try {
        await fetch(`${this.endpoint}/statements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(statement),
        });
      } catch (err) {
        console.error('Failed to send xAPI statement to LRS:', err);
      }
    }

    // Always save to local DB
    await updateLessonProgress(this.lessonId, {
      xapiStatement: statement as unknown as Record<string, unknown>,
      completed: statement.verb.id === VERBS.completed,
      progressPercent: statement.result?.score?.scaled
        ? statement.result.score.scaled * 100
        : undefined,
    });
  }

  async initialized() {
    await this.sendStatement(this.buildStatement(VERBS.initialized, 'initialized'));
  }

  async progressed(progressPercent: number, positionSeconds: number) {
    const statement = this.buildStatement(VERBS.progressed, 'progressed', {
      score: { scaled: progressPercent / 100 },
    });

    await updateLessonProgress(this.lessonId, {
      progressPercent,
      lastPositionSeconds: positionSeconds,
      xapiStatement: statement as unknown as Record<string, unknown>,
    });
  }

  async completed() {
    await this.sendStatement(this.buildStatement(VERBS.completed, 'completed', {
      completion: true,
      score: { scaled: 1 },
    }));
  }
}
