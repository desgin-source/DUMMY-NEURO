import Database from 'better-sqlite3';

export interface ConversationRecord {
  id: number;
  title: string;
  transcription: string;
  duration: number; // in seconds
  created_at: string;
  updated_at: string;
  audio_file_name?: string;
  summary?: string;
  tags?: string;
}

class MemoryDatabase {
  private db: Database.Database;

  constructor() {
    // Initialize SQLite database
    this.db = new Database('memory.db');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create conversations table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        transcription TEXT NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        audio_file_name TEXT,
        summary TEXT,
        tags TEXT
      )
    `;

    this.db.exec(createTableQuery);

    // Create index for faster searches
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON conversations(created_at)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_title ON conversations(title)');
  }

  // Save a new conversation
  saveConversation(data: Omit<ConversationRecord, 'id' | 'created_at' | 'updated_at'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (title, transcription, duration, audio_file_name, summary, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.title,
      data.transcription,
      data.duration,
      data.audio_file_name || null,
      data.summary || null,
      data.tags || null
    );

    return result.lastInsertRowid as number;
  }

  // Get all conversations with pagination
  getAllConversations(limit: number = 50, offset: number = 0): ConversationRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);

    return stmt.all(limit, offset) as ConversationRecord[];
  }

  // Get conversation by ID
  getConversationById(id: number): ConversationRecord | null {
    const stmt = this.db.prepare('SELECT * FROM conversations WHERE id = ?');
    return stmt.get(id) as ConversationRecord | null;
  }

  // Search conversations by text
  searchConversations(query: string): ConversationRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE title LIKE ? OR transcription LIKE ? OR summary LIKE ?
      ORDER BY created_at DESC
    `);

    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm) as ConversationRecord[];
  }

  // Update conversation
  updateConversation(id: number, data: Partial<ConversationRecord>): boolean {
    const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) return false;

    const stmt = this.db.prepare(`
      UPDATE conversations 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const values = fields.map(field => data[field as keyof ConversationRecord]);
    values.push(id);

    const result = stmt.run(...values);
    return result.changes > 0;
  }

  // Delete conversation
  deleteConversation(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM conversations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get conversation statistics
  getStats() {
    const totalStmt = this.db.prepare('SELECT COUNT(*) as total FROM conversations');
    const totalDurationStmt = this.db.prepare('SELECT SUM(duration) as total_duration FROM conversations');
    const recentStmt = this.db.prepare('SELECT COUNT(*) as recent FROM conversations WHERE created_at >= datetime("now", "-7 days")');

    const total = totalStmt.get() as { total: number };
    const totalDuration = totalDurationStmt.get() as { total_duration: number };
    const recent = recentStmt.get() as { recent: number };

    return {
      totalConversations: total.total,
      totalDuration: totalDuration.total_duration || 0,
      recentConversations: recent.recent
    };
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

// Export singleton instance
export const memoryDB = new MemoryDatabase();