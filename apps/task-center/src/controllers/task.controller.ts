import { Post, Controller, Body, Param, Inject, NotFoundException } from "@nestjs/common";
import { ITask } from "../tasks/task";
import { IGroupService } from "libs/api/infra-api/src/group/group.service";

@Controller('/tasks')
export class TaskController {
  constructor(
    @Inject('tasks') private readonly tasks: Record<string, ITask>,
  ) {}

  @Post(':name')
  run(@Param('name') name: string, @Body() params: Record<string, any>) {
    const task = this.tasks[name];
    if (!task) throw new NotFoundException();

    task.run(params);
  }
}