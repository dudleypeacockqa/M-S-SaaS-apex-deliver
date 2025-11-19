import BlogAdminEditor from '@/pages/admin/BlogAdminEditor';

const TestBlogAdminPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4" data-testid="blog-admin-test-harness">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900 mb-1">BlogAdminEditor Test Harness</p>
        <p>
          This route is only available when <code>VITE_ENABLE_TEST_ROUTES=true</code> and is used for
          Playwright evidence. Network calls are expected to be stubbed in tests.
        </p>
      </div>
      <BlogAdminEditor enableAutoSave={false} navigateOnPublish={false} />
    </div>
  );
};

export default TestBlogAdminPage;
