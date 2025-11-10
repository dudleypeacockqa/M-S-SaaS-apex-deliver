# BMAD Quality Log

> Initialize test + coverage evidence log. Populate after baseline capture.
## 2025-11-01 07:45:27 +00:00 - Backend pytest baseline
Command: python -m pytest backend/tests --maxfail=1 -q
Result:
 ``` 
...............................................s........................ [  9%]
........................................................................ [ 19%]
........................................................................ [ 29%]
........................................................................ [ 39%]
........................................................s..F
================================== FAILURES ===================================
_______________________ test_activity_crud_and_listing ________________________

client = <starlette.testclient.TestClient object at 0x0000021E00715210>
auth_headers_admin = {'Authorization': 'Bearer mock_admin_token'}

    def test_activity_crud_and_listing(client, auth_headers_admin):
        headers = auth_headers_admin
        today = date.today().isoformat()
    
        first_payload = {
            "type": "discovery",
            "status": "done",
            "date": today,
            "amount": 2,
            "notes": "Discovery calls",
        }
>       first_resp = client.post("/api/master-admin/activities", json=first_payload, headers=headers)

backend\tests\test_master_admin_api.py:70: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\testclient.py:590: in post
    return super().post(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:1145: in post
    return self.request(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\testclient.py:465: in request
    return super().request(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:827: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:914: in send
    response = self._send_handling_auth(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:942: in _send_handling_auth
    response = self._send_handling_redirects(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:979: in _send_handling_redirects
    response = self._send_single_request(request)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:1015: in _send_single_request
    response = transport.handle_request(request)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\testclient.py:342: in handle_request
    raise exc
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\testclient.py:339: in handle_request
    portal.call(self.app, scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\anyio\from_thread.py:277: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\concurrent\futures\_base.py:456: in result
    return self.__get_result()
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\concurrent\futures\_base.py:401: in __get_result
    raise self._exception
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\anyio\from_thread.py:217: in _call_func
    retval = await retval
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\applications.py:1106: in __call__
    await super().__call__(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\applications.py:122: in __call__
    await self.middleware_stack(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\middleware\errors.py:184: in __call__
    raise exc
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\middleware\errors.py:162: in __call__
    await self.app(scope, receive, _send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\middleware\cors.py:83: in __call__
    await self.app(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\middleware\exceptions.py:79: in __call__
    raise exc
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\middleware\exceptions.py:68: in __call__
    await self.app(scope, receive, sender)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\middleware\asyncexitstack.py:20: in __call__
    raise e
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\middleware\asyncexitstack.py:17: in __call__
    await self.app(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\routing.py:718: in __call__
    await route.handle(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\routing.py:276: in handle
    await self.app(scope, receive, send)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\routing.py:66: in app
    response = await func(request)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\routing.py:274: in app
    raw_response = await run_endpoint_function(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\routing.py:193: in run_endpoint_function
    return await run_in_threadpool(dependant.call, **values)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\starlette\concurrency.py:41: in run_in_threadpool
    return await anyio.to_thread.run_sync(func, *args)
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\anyio\to_thread.py:33: in run_sync
    return await get_asynclib().run_sync_in_worker_thread(
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\anyio\_backends\_asyncio.py:877: in run_sync_in_worker_thread
    return await future
C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\anyio\_backends\_asyncio.py:807: in run
    result = context.run(func, *args)
backend\app\api\routes\master_admin.py:221: in create_activity
    created_activity = master_admin_service.create_admin_activity(activity, current_user, db)
backend\app\services\master_admin_service.py:167: in create_admin_activity
    type=activity_data.type,
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = AdminActivityCreate(activity_type=<ActivityType.DISCOVERY: 'discovery'>, status=<ActivityStatus.DONE: 'done'>, date=datetime.date(2025, 11, 1), amount=2, notes='Discovery calls', prospect_id=None)
item = 'type'

    def __getattr__(self, item: str) -> Any:
        private_attributes = object.__getattribute__(self, '__private_attributes__')
        if item in private_attributes:
            attribute = private_attributes[item]
            if hasattr(attribute, '__get__'):
                return attribute.__get__(self, type(self))  # type: ignore
    
            try:
                # Note: self.__pydantic_private__ cannot be None if self.__private_attributes__ has items
                return self.__pydantic_private__[item]  # type: ignore
            except KeyError as exc:
                raise AttributeError(f'{type(self).__name__!r} object has no attribute {item!r}') from exc
        else:
            # `__pydantic_extra__` can fail to be set if the model is not yet fully initialized.
            # See `BaseModel.__repr_args__` for more details
            try:
                pydantic_extra = object.__getattribute__(self, '__pydantic_extra__')
            except AttributeError:
                pydantic_extra = None
    
            if pydantic_extra:
                try:
                    return pydantic_extra[item]
                except KeyError as exc:
                    raise AttributeError(f'{type(self).__name__!r} object has no attribute {item!r}') from exc
            else:
                if hasattr(self.__class__, item):
                    return super().__getattribute__(item)  # Raises AttributeError if appropriate
                else:
                    # this is the current error
>                   raise AttributeError(f'{type(self).__name__!r} object has no attribute {item!r}')
E                   AttributeError: 'AdminActivityCreate' object has no attribute 'type'

C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\pydantic\main.py:828: AttributeError
============================== warnings summary ===============================
..\..\..\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\pydantic\_internal\_config.py:291
  C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\pydantic\_internal\_config.py:291: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.8/migration/
    warnings.warn(DEPRECATION_MESSAGE, DeprecationWarning)

backend\tests\test_netsuite_integration.py:30
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:30: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:42
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:42: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:59
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:59: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:97
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:97: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:114
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:114: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:132
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:132: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:153
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:153: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:209
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:209: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:229
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:229: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_netsuite_integration.py:249
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_netsuite_integration.py:249: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:29
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:29: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:49
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:49: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:66
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:66: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:104
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:104: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:121
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:121: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:143
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:143: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:164
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:164: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:219
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:219: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_quickbooks_integration.py:238
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_quickbooks_integration.py:238: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:28
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:28: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:40
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:40: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:57
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:57: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:95
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:95: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:112
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:112: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:130
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:130: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:151
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:151: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:206
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:206: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_sage_integration.py:226
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_sage_integration.py:226: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:30
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:30: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:47
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:47: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:63
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:63: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:104
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:104: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:136
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:136: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:153
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:153: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:175
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:175: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:196
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:196: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend\tests\test_xero_integration.py:284
  C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver\backend\tests\test_xero_integration.py:284: PytestUnknownMarkWarning: Unknown pytest.mark.integration - is this a typo?  You can register custom marks to avoid this warning - for details, see https://docs.pytest.org/en/stable/how-to/mark.html
    @pytest.mark.integration

backend/tests/test_admin_endpoints.py: 20 warnings
backend/tests/test_admin_users_api.py: 12 warnings
backend/tests/test_billing_endpoints.py: 14 warnings
backend/tests/test_billing_simple.py: 3 warnings
backend/tests/test_clerk_auth_complete.py: 23 warnings
backend/tests/test_deal_endpoints.py: 25 warnings
backend/tests/test_deal_matching_api.py: 16 warnings
backend/tests/test_document_endpoints.py: 39 warnings
backend/tests/test_financial_api.py: 24 warnings
backend/tests/test_master_admin_api.py: 3 warnings
  C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:680: DeprecationWarning: The 'app' shortcut is now deprecated. Use the explicit style 'transport=WSGITransport(app=...)' instead.
    warnings.warn(message, DeprecationWarning)

backend/tests/test_clerk_auth_complete.py: 24 warnings
  C:\Users\User\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_content.py:202: DeprecationWarning: Use 'content=<...>' to upload raw bytes/text content.
    warnings.warn(message, DeprecationWarning)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
=========================== short test summary info ===========================
SKIPPED [1] backend\tests\test_admin_users_api.py:284: /api/admin/users endpoint removed in commit 1878035 - superseded by master_admin API
SKIPPED [1] backend\tests\test_financial_xero_integration.py:9: To be implemented in ratio engine phase
FAILED backend/tests/test_master_admin_api.py::test_activity_crud_and_listing
!!!!!!!!!!!!!!!!!!!!!!!!!! stopping after 1 failures !!!!!!!!!!!!!!!!!!!!!!!!!!
1 failed, 345 passed, 2 skipped, 241 warnings in 103.49s (0:01:43)
 ``` 

## 2025-11-01 07:49:43 +00:00 - Frontend vitest baseline
Command: npm --prefix frontend run test -- --runInBand --watch=false --bail
Result:
 ``` 

> ma-saas-frontend@2.0.0 test
> vitest --run --runInBand --watch=false --bail

file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:404
          throw new CACError(`Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``);
                ^
System.Management.Automation.RemoteException
CACError: Unknown option `--runInBand`
    at Command.checkUnknownOptions (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:404:17)
    at CAC.runMatchedCommand (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:604:13)
    at CAC.parse (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:545:12)
    at file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/cli.js:28:13
    at ModuleJob.run (node:internal/modules/esm/module_job:377:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:691:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
System.Management.Automation.RemoteException
Node.js v25.0.0
 ``` 

## 2025-11-01 07:50:18 +00:00 - Frontend vitest baseline
Command: npm --prefix frontend run test -- --run --bail
Result:
 ``` 

> ma-saas-frontend@2.0.0 test
> vitest --run --run --bail

file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:1205
			throw new Error(`Expected a single value for option "${command}", received [${received}]`);
			      ^
System.Management.Automation.RemoteException
Error: Expected a single value for option "--run", received [true, true]
    at transform (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:1205:10)
    at setDotProp (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:207:22)
    at CAC.mri (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:591:9)
    at CAC.parse (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:508:27)
    at file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/cli.js:28:13
    at ModuleJob.run (node:internal/modules/esm/module_job:377:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:691:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
System.Management.Automation.RemoteException
Node.js v25.0.0
 ``` 

## 2025-11-01 07:50:38 +00:00 - Frontend vitest baseline
Command: npm --prefix frontend run test -- --run
Result:
 ``` 

> ma-saas-frontend@2.0.0 test
> vitest --run --run

file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:1205
			throw new Error(`Expected a single value for option "${command}", received [${received}]`);
			      ^
System.Management.Automation.RemoteException
Error: Expected a single value for option "--run", received [true, true]
    at transform (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:1205:10)
    at setDotProp (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:207:22)
    at CAC.mri (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:591:9)
    at CAC.parse (file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/chunks/cac.39_DDnyx.js:508:27)
    at file:///C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver/frontend/node_modules/vitest/dist/cli.js:28:13
    at ModuleJob.run (node:internal/modules/esm/module_job:377:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:691:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
System.Management.Automation.RemoteException
Node.js v25.0.0
 ``` 

