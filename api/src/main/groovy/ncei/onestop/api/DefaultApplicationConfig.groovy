package ncei.onestop.api

import org.elasticsearch.common.settings.Settings
import org.elasticsearch.shield.ShieldPlugin
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.elasticsearch.common.transport.InetSocketTransportAddress
import org.elasticsearch.client.Client
import org.elasticsearch.client.transport.TransportClient
import org.elasticsearch.plugin.deletebyquery.DeleteByQueryPlugin
import org.springframework.context.annotation.Profile

@Configuration
@Profile("default")
class DefaultApplicationConfig {

  @Value('${elasticsearch.cluster.name}')
  String clusterName

  @Value('${elasticsearch.port}')
  Integer elasticPort

  @Value('${elasticsearch.host}')
  String elasticHost

  @Value('${elasticsearch.ro.user:}')
  String roUser

  @Value('${elasticsearch.ro.pass:}')
  String roPassword

  @Value('${elasticsearch.rw.user:}')
  String rwUser

  @Value('${elasticsearch.rw.pass:}')
  String rwPassword

  @Bean(destroyMethod = 'close')
  public Client searchClient() {
    def builder = TransportClient.builder()
    def settingsBuilder = Settings.builder()

    settingsBuilder.put('cluster.name', clusterName)

    if (roUser && roPassword) {
      builder.addPlugin(ShieldPlugin)
      settingsBuilder.put('shield.user', "${roUser}:${roPassword}")
    }

    def client = builder.settings(settingsBuilder.build()).build()
    client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(elasticHost), elasticPort))
  }

  @Bean(destroyMethod = 'close')
  public Client adminClient() {
    def builder = TransportClient.builder()
    def settingsBuilder = Settings.builder()

    builder.addPlugin(DeleteByQueryPlugin)
    settingsBuilder.put('cluster.name', clusterName)

    if (rwUser && rwPassword) {
      builder.addPlugin(ShieldPlugin)
      settingsBuilder.put('shield.user', "${rwUser}:${rwPassword}")
    }

    def client = builder.settings(settingsBuilder.build()).build()
    client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(elasticHost), elasticPort))
  }

}