import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onTestBegin(test: TestCase, _result: TestResult) {
    report({
      run: getRun(),
      status: 'running',
      test_name: test.titlePath().join(' > '),
    });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    report({
      duration: result.duration,
      run: getRun(),
      status: result.status === 'passed' ? 'success' : 'failure',
      test_name: test.titlePath().join(' > '),
    });
  }
}

export default MyReporter;

const getRun = () => {
  return {
    commit: process.env['GITHUB_SHA'],
    id: `${process.env['GITHUB_RUN_ID']}/attempts/${process.env['GITHUB_RUN_ATTEMPT']}`,
    started_at: Math.round(Date.parse(process.env['ACTIONS_RUN_CREATED_AT'] ?? '0') / 1000),
  };
};

const report = (body: unknown) => {
  fetch(`${process.env['REPORT_URL']}/api/v1/result`, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${process.env['REPORT_TOKEN']}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`Failed to report: HTTP ${res.status} ${res.statusText}`);
      }
    })
    .catch((err: unknown) => {
      console.error('Failed to report:', err);
    });
};
