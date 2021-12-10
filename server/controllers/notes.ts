import * as express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Note } from '../entity/Note';
import { User } from '../entity/User';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Posts
router.get('/', verifyToken, async (req: Request, res: Response) => {
  const noteRepo = getRepository(Note);
  const result = await noteRepo.find();
  return res.status(200).json(result);
});

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const noteRepo = getRepository(Note);
  const result = await noteRepo.find({ id });
  return res.status(200).json(result);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const userRepo = getRepository(User);
    const noteRepo = getRepository(Note);

    const user = await userRepo.findOne(req.user);

    const note = new Note();
    note.title = title;
    note.content = content;
    note.views = 0;
    note.user = user;
    note.public = true;

    const results = await noteRepo.save(note);
    return res.status(201).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // const { title, content } = req.body;

  const userRepo = getRepository(User);
  const user = await userRepo.findOne(req.user);
  console.log(user);
  return res.status(404).end();
  // const noteRepo = getRepository(Note)
  // const note = await noteRepo()
});

router.delete('/:id', (req: Request, res: Response) => {
  console.log('not implemented');
  res.status(200).json({});
});

export { router as notesRouter };
