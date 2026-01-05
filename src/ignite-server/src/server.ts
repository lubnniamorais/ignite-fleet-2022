import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Interface que espelha o seu Schema do Realm
interface HistoricBody {
  user_id: string;
  license_plate: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  isSynced: boolean;
}

// Substitua pela sua URL do Atlas (ou use .env)
const uri =
  'mongodb+srv://admin:<ignitefleet>@cluster0.j1nasbd.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

app.post('/sync', async (req: Request<{}, {}, HistoricBody>, res: Response) => {
  try {
    await client.connect();
    const database = client.db('ignitefleet');
    const collection = database.collection('historic');

    // Removemos o isSynced do objeto antes de salvar no banco,
    // já que no banco de dados ele sempre será 'true' por estar lá.
    const { isSynced, ...dataToSave } = req.body;

    const result = await collection.insertOne({
      ...dataToSave,
      synced_at: new Date(), // Opcional: registrar quando subiu para a nuvem
    });

    return res.status(201).json({
      message: 'Sincronizado com sucesso!',
      id: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao salvar no MongoDB' });
  } finally {
    await client.close();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript rodando em http://localhost:${PORT}`);
});
