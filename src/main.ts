import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(3333)

	const configService = app.get<ConfigService<Env, true>>(ConfigService)
	const port = configService.get('PORT', { infer: true })

	await app.listen(port)
}
bootstrap()
