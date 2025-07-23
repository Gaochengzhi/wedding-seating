import fs from 'fs'
import path from 'path'
import { createObjectCsvWriter } from 'csv-writer'
import { fileURLToPath } from 'url'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 从环境变量或默认值获取配置
const config = {
    TOTAL_TABLES: parseInt(process.env.TOTAL_TABLES) || 22,
    TABLES_PER_SIDE: parseInt(process.env.TABLES_PER_SIDE) || 11
}

// 模板文件目录
const templatesDir = path.join(__dirname, 'templates')

// 确保模板目录存在
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true })
}

// CSV文件头定义
const guestsHeaders = [
    { id: 'name', title: 'name' },
    { id: 'gender', title: 'gender' },
    { id: 'phone', title: 'phone' },
    { id: 'notes', title: 'notes' },
    { id: 'accommodation', title: 'accommodation' },
    { id: 'relationship', title: 'relationship' },
    { id: 'tableid', title: 'tableid' },
    { id: 'seatid', title: 'seatid' },
    { id: 'seatnumber', title: 'seatnumber' },
    { id: 'timestamp', title: 'timestamp' }
]

const tablesHeaders = [
    { id: 'tableid', title: 'tableid' },
    { id: 'displaynumber', title: 'displaynumber' },
    { id: 'side', title: 'side' },
    { id: 'notes', title: 'notes' },
    { id: 'timestamp', title: 'timestamp' }
]

const relationshipsHeaders = [
    { id: 'value', title: 'value' },
    { id: 'label', title: 'label' },
    { id: 'category', title: 'category' },
    { id: 'order', title: 'order' },
    { id: 'timestamp', title: 'timestamp' }
]

// 生成空的guests.csv模板
const generateGuestsTemplate = async () => {
    const csvWriter = createObjectCsvWriter({
        path: path.join(templatesDir, 'guests.csv'),
        header: guestsHeaders
    })
    
    await csvWriter.writeRecords([])
    console.log(`✅ 生成空的 guests.csv 模板`)
}

// 生成干净的tables.csv模板
const generateTablesTemplate = async () => {
    const csvWriter = createObjectCsvWriter({
        path: path.join(templatesDir, 'tables.csv'),
        header: tablesHeaders
    })
    
    const tables = []
    for (let i = 1; i <= config.TOTAL_TABLES; i++) {
        const side = i <= config.TABLES_PER_SIDE ? 'left' : 'right'
        const displayNumber = side === 'left' ? i : i - config.TABLES_PER_SIDE
        
        tables.push({
            tableid: `table_${i}`,
            displaynumber: displayNumber,
            side: side,
            notes: '', // 空备注
            timestamp: '2025-01-01T00:00:00.000Z'
        })
    }
    
    await csvWriter.writeRecords(tables)
    console.log(`✅ 生成包含 ${config.TOTAL_TABLES} 桌的 tables.csv 模板（无备注）`)
}

// 生成默认relationships.csv模板
const generateRelationshipsTemplate = async () => {
    const csvWriter = createObjectCsvWriter({
        path: path.join(templatesDir, 'relationships.csv'),
        header: relationshipsHeaders
    })
    
    const defaultRelationships = [
        { value: 'groom_classmate', label: '男方同学/同事', category: 'groom', order: 1, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'bride_classmate', label: '女方同学/同事', category: 'bride', order: 2, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'groom_father_friends', label: '男方爸爸亲友', category: 'groom_family', order: 3, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'groom_mother_friends', label: '男方妈妈亲友', category: 'groom_family', order: 4, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'bride_father_friends', label: '女方爸爸亲友', category: 'bride_family', order: 5, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'bride_mother_friends', label: '女方妈妈亲友', category: 'bride_family', order: 6, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'groom_father_colleagues', label: '男方爸爸同事', category: 'groom_family', order: 7, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'bride_father_colleagues', label: '女方爸爸同事', category: 'bride_family', order: 8, timestamp: '2025-01-01T00:00:00.000Z' },
        { value: 'other', label: '其他', category: 'other', order: 9, timestamp: '2025-01-01T00:00:00.000Z' }
    ]
    
    await csvWriter.writeRecords(defaultRelationships)
    console.log(`✅ 生成包含 ${defaultRelationships.length} 个默认关系的 relationships.csv 模板`)
}

// 主函数
const generateAllTemplates = async () => {
    console.log('🏗️  开始生成CSV模板文件...')
    console.log(`📊 配置: ${config.TOTAL_TABLES} 桌 (每侧 ${config.TABLES_PER_SIDE} 桌)`)
    
    try {
        await generateGuestsTemplate()
        await generateTablesTemplate()
        await generateRelationshipsTemplate()
        
        console.log('🎉 所有CSV模板文件生成完成！')
    } catch (error) {
        console.error('❌ 生成模板文件时出错:', error)
        process.exit(1)
    }
}

// 如果直接运行此文件，则执行生成
if (import.meta.url === `file://${process.argv[1]}`) {
    generateAllTemplates()
}

export { generateAllTemplates }