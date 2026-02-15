create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'missed-med-check', 
  '0 * * * *',
  $$
  select
    net.http_post(
        url:='https://txwwvrwxtsduglvvnprs.supabase.co/functions/v1/check-missed-medications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb
    ) as request_id;
  $$
);