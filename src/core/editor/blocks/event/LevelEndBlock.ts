import { BaseBlock } from '../../BaseBlock'
import { BlockCategory } from '../../BlockCategories'
import { ExecutionContext } from '@/core/engine/ExecutionContext'

export class LevelEndBlock extends BaseBlock {
    readonly id = 'level-end'
    readonly label = 'Level End'
    readonly category = BlockCategory.EVENT

    // execute(context: ExecutionContext): void {
    //    context.finishLevel?.() TODO: finishLevel
    // }
    execute(context: ExecutionContext): void {
        console.log('Level End reached')
    }
}