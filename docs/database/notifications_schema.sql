-- ============================================
-- DYNAMIC DAILY NOTIFICATIONS SCHEMA
-- ============================================
-- This schema supports:
-- 1. Daily notification generation
-- 2. Per-user read/unread tracking
-- 3. Notification history (30 days)
-- 4. Field-based filtering
-- ============================================

-- Drop existing tables if any
DROP TABLE IF EXISTS user_notification_reads CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    field_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('skill', 'trend', 'warning', 'certification', 'update', 'opportunity')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    category TEXT,
    action_text TEXT,
    action_url TEXT,
    action_required BOOLEAN DEFAULT false,
    source_url TEXT,
    
    -- Date tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_notifications_field ON notifications(field_id);
CREATE INDEX idx_notifications_date ON notifications(generated_date DESC);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);

-- Comment
COMMENT ON TABLE notifications IS 'Stores all generated notifications with daily batches';
COMMENT ON COLUMN notifications.generated_date IS 'The date this notification was generated (for daily batches)';

-- ============================================
-- 2. USER NOTIFICATION READS TABLE
-- ============================================
CREATE TABLE user_notification_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    notification_id TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one read per user per notification
    UNIQUE(user_id, notification_id)
);

-- Indexes for performance
CREATE INDEX idx_user_reads_user ON user_notification_reads(user_id);
CREATE INDEX idx_user_reads_notif ON user_notification_reads(notification_id);
CREATE INDEX idx_user_reads_composite ON user_notification_reads(user_id, notification_id);

-- Comment
COMMENT ON TABLE user_notification_reads IS 'Tracks which notifications each user has read';

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Function to get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM notifications n
        WHERE NOT EXISTS (
            SELECT 1 
            FROM user_notification_reads r 
            WHERE r.notification_id = n.id 
            AND r.user_id = p_user_id
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to mark all as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    inserted_count INTEGER;
BEGIN
    INSERT INTO user_notification_reads (user_id, notification_id)
    SELECT p_user_id, n.id
    FROM notifications n
    WHERE NOT EXISTS (
        SELECT 1 
        FROM user_notification_reads r 
        WHERE r.notification_id = n.id 
        AND r.user_id = p_user_id
    )
    ON CONFLICT (user_id, notification_id) DO NOTHING;
    
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old notifications (30+ days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications
    WHERE generated_date < CURRENT_DATE - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. VIEWS
-- ============================================

-- View to show notifications with read counts
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
    n.id,
    n.field_id,
    n.field_name,
    n.type,
    n.title,
    n.priority,
    n.generated_date,
    n.created_at,
    COUNT(r.id) as read_count,
    (SELECT COUNT(*) FROM user_notification_reads WHERE notification_id = n.id) as total_reads
FROM notifications n
LEFT JOIN user_notification_reads r ON r.notification_id = n.id
GROUP BY n.id, n.field_id, n.field_name, n.type, n.title, n.priority, n.generated_date, n.created_at
ORDER BY n.generated_date DESC, n.created_at DESC;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_reads ENABLE ROW LEVEL SECURITY;

-- Notifications policies
-- Everyone can read notifications
CREATE POLICY "Notifications are viewable by everyone"
    ON notifications FOR SELECT
    USING (true);

-- Only admins can insert/update/delete notifications
CREATE POLICY "Notifications are insertable by admins"
    ON notifications FOR INSERT
    WITH CHECK (false); -- Will be handled by backend service account

CREATE POLICY "Notifications are updatable by admins"
    ON notifications FOR UPDATE
    USING (false); -- Will be handled by backend service account

CREATE POLICY "Notifications are deletable by admins"
    ON notifications FOR DELETE
    USING (false); -- Will be handled by backend service account

-- User notification reads policies
-- Users can only see their own reads
CREATE POLICY "Users can view their own reads"
    ON user_notification_reads FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can mark notifications as read
CREATE POLICY "Users can mark notifications as read"
    ON user_notification_reads FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users cannot update reads
CREATE POLICY "Users cannot update reads"
    ON user_notification_reads FOR UPDATE
    USING (false);

-- Users cannot delete reads
CREATE POLICY "Users cannot delete reads"
    ON user_notification_reads FOR DELETE
    USING (false);

-- ============================================
-- 6. SAMPLE DATA (for testing)
-- ============================================

-- Insert sample notifications for today
INSERT INTO notifications (
    id, field_id, field_name, type, title, message, priority, category, 
    action_text, action_url, generated_date
) VALUES
    (
        'eng-' || extract(epoch from now())::bigint || '-0',
        'engineering',
        'Engineering & Technology',
        'trend',
        'AI Revolution in Software Engineering',
        'Discover how AI tools are transforming code development and automation in 2026',
        'high',
        'Industry Update',
        'Learn More',
        'https://example.com/ai-software',
        CURRENT_DATE
    ),
    (
        'eng-' || extract(epoch from now())::bigint || '-1',
        'engineering',
        'Engineering & Technology',
        'skill',
        'Master Kubernetes & Cloud Native',
        'Build expertise in container orchestration - a must-have skill for modern DevOps',
        'medium',
        'Skill Development',
        'Start Learning',
        'https://example.com/kubernetes',
        CURRENT_DATE
    ),
    (
        'medical-' || extract(epoch from now())::bigint || '-0',
        'medical',
        'Medical & Health Sciences',
        'opportunity',
        'Telemedicine Certification Program',
        'New certification program for digital healthcare professionals opens this week',
        'high',
        'Career Opportunity',
        'Apply Now',
        'https://example.com/telemedicine',
        CURRENT_DATE
    );

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

-- Grant permissions to authenticated users
GRANT SELECT ON notifications TO authenticated;
GRANT SELECT, INSERT ON user_notification_reads TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions to service role (for backend)
GRANT ALL ON notifications TO service_role;
GRANT ALL ON user_notification_reads TO service_role;

-- ============================================
-- SETUP COMPLETE
-- ============================================
