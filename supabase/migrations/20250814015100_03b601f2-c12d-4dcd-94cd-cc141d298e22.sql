-- Create a function to ensure every profile has a client
CREATE OR REPLACE FUNCTION ensure_user_has_client()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profiles without clients and create clients for them
    FOR profile_record IN 
        SELECT p.id as profile_id, p.user_id, p.full_name
        FROM profiles p 
        LEFT JOIN clients c ON c.profile_id = p.id 
        WHERE c.id IS NULL AND p.user_type = 'client'
    LOOP
        -- Create client for this profile
        INSERT INTO clients (
            profile_id,
            client_type,
            trial_start_date,
            trial_end_date,
            subscription_active,
            subscription_status
        ) VALUES (
            profile_record.profile_id,
            'personal',
            now(),
            now() + interval '7 days',
            false,
            'trial'
        );
        
        RAISE NOTICE 'Created client for profile % (user %)', profile_record.profile_id, profile_record.user_id;
    END LOOP;
END;
$$;

-- Execute the function to fix existing users
SELECT ensure_user_has_client();