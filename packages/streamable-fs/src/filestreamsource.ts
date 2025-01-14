/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { File } from "./types";
import { Chunk } from "@notesnook/crypto/dist/src/types";

export default class FileStreamSource implements UnderlyingSource<Chunk> {
  private storage: LocalForage;
  private file: File;
  private offset = 0;

  constructor(storage: LocalForage, file: File) {
    this.storage = storage;
    this.file = file;
  }

  start() {}

  async pull(controller: ReadableStreamController<Chunk>) {
    const data = await this.readChunk(this.offset++);
    const isFinalChunk = this.offset === this.file.chunks;

    if (data)
      controller.enqueue({
        data,
        final: isFinalChunk
      });

    if (isFinalChunk || !data) controller.close();
  }

  private readChunk(offset: number) {
    if (offset > this.file.chunks) return;
    return this.storage.getItem<Uint8Array>(this.getChunkKey(offset));
  }

  private getChunkKey(offset: number): string {
    return `${this.file.filename}-chunk-${offset}`;
  }
}
