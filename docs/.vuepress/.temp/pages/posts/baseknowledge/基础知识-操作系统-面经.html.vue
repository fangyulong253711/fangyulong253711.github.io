<template><p>@<a href="%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E6%B1%87%E6%80%BB">TOC</a></p>
<h1 id="计算机网络汇总" tabindex="-1"><a class="header-anchor" href="#计算机网络汇总" aria-hidden="true">#</a> 计算机网络汇总</h1>
<h2 id="应用层-应用-表示-会话" tabindex="-1"><a class="header-anchor" href="#应用层-应用-表示-会话" aria-hidden="true">#</a> 应用层(应用,表示,会话)</h2>
<h3 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> http</h3>
<h3 id="https" tabindex="-1"><a class="header-anchor" href="#https" aria-hidden="true">#</a> https</h3>
<p>工作原理HTTPS工作原理</p>
<ul>
<li>一、首先HTTP请求服务端生成证书，客户端对证书的有效期、合法性、域名是否与请求的域名一致、证书的公钥（RSA加密）等进行校验；</li>
<li>二、客户端如果校验通过后，就根据证书的公钥的有效， 生成随机数，随机数使用公钥进行加密（RSA加密）；</li>
<li>三、消息体产生的后，对它的摘要进行MD5（或者SHA1）算法加密，此时就得到了RSA签名；</li>
<li>四、发送给服务端，此时只有服务端（RSA私钥）能解密。</li>
<li>五、解密得到的随机数，再用AES加密，作为密钥（此时的密钥只有客户端和服务端知道）。</li>
</ul>
<p><img src="https://img-blog.csdnimg.cn/img_convert/d4dfb9247b64ae1933f7a568ea11af17.png#pic_center" alt="在这里插入图片描述" loading="lazy">
<img src="https://img-blog.csdnimg.cn/img_convert/e9a870e457dca2f63dffe8272f970ab5.png#pic_center" alt="在这里插入图片描述" loading="lazy"></p>
<h3 id="dns" tabindex="-1"><a class="header-anchor" href="#dns" aria-hidden="true">#</a> DNS</h3>
<p>域名系统（英文：Domain Name System，缩写：DNS）是互联网的一项服务。它作为将域名和IP地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。DNS使用TCP和UDP端口53。当前，对于每一级域名长度的限制是63个字符，域名总长度则不能超过253个字符。2.1 本地域名服务器LDNS</p>
<p>每个电脑里面都设置了本地DNS服务器（简称LDNS），需要的时候，就向LDNS发出请求，LDNS在网上问权威域名服务器（简称权威DNS）得到答案。</p>
<p>权威域名服务器</p>
<p>问我一个域名，我告诉你IP，如果我不知道，我告诉你谁可能知道，你再去问它。
负责对请求作出权威的回答。权威DNS中存储着记录，最常见的3种：A记录（记录某域名和其IP的对应），NS记录（记录某域名和负责解析该域的权威DNS），CNAME记录（负责记录某域名及其别名）。权威能直接回答的，就回A记录；需要其他权威DNS回答的，就回NS记录，然后LDNS再去找其他权威DNS问；如果该记录是别名类型的，就回CNAME，LDNS就会再去解析别名。</p>
<p>根域名服务器—根DNS</p>
<p>当LDNS啥都不知道的时候（也即没有任何缓存），就去问根DNS，根能告诉LDNS下一步该问谁。</p>
<p>具体过程</p>
<ul>
<li>权威DNS：权威能直接回答的，就回ip；需要其他权威DNS回答的，就回NS记录（记录某域名和负责解析该域的权威DNS），然后LDNS再去找其他权威DNS问；如果该记录是别名类型的，就回CNAME（负责记录某域名及其别名），LDNS就会再去解析别名。</li>
<li>递归DNS：通常就是LDNS，它接受终端的域名查询请求，负责在网上问一圈后，将答案返回终端。</li>
</ul>
<h2 id="传输层" tabindex="-1"><a class="header-anchor" href="#传输层" aria-hidden="true">#</a> 传输层</h2>
<h3 id="tcp" tabindex="-1"><a class="header-anchor" href="#tcp" aria-hidden="true">#</a> TCP</h3>
<p>主要特点（1）慢启动</p>
<p>每当建立一个TCP连接时或一个TCP连接发生超时重传后，该连接便进入慢启动阶段。进入慢启动后，TCP实体将拥塞窗口的大小初始化为一个报文段，即：cwnd=1。此后，每收到一个报文段的确认（ACK），cwnd值加1，即拥塞窗口按指数增加。当cwnd值超过慢启动阐值（ssthresh）或发生报文段丢失重传时，慢启动阶段结束。前者进入拥塞避免阶段，后者重新进入慢启动阶段。</p>
<p>（2）拥塞避免</p>
<p>在慢启阶段，当cwnd值超过慢启动阐值（ssthresh）后，慢启动过程结束，TCP连接进入拥塞避免阶段。在拥塞避免阶段，每一次发送的cwnd个报文段被完全确认后，才将cwnd值加1。在此阶段，cwnd值线性增加。</p>
<p>（3）快速重传</p>
<p>快速重传是对超时重传的改进。当源端收到对同一个报文的三个重复确认时，就确定一个报文段已经丢失，因此立刻重传丢失的报文段，而不必等到重传定时器（RTO）超时。以此减少不必要的等待时间。</p>
<p>（4）快速恢复</p>
<p>快速恢复是对丢失恢复机制的改进。在快速重传之后，不经过慢启动过程而直接进入拥塞避免阶段。每当快速重传后，置ssthresh=cwnd/2、ewnd=ssthresh+3。此后，每收到一个重复确认，将cwnd值加1，直至收到对丢失报文段和其后若干报文段的累积确认后，置cwnd=ssthresh，进入拥塞避免阶段。
<img src="https://img-blog.csdnimg.cn/img_convert/b46604c9f6016d320361b562581ffa4d.png" alt="img" loading="lazy"></p>
<h3 id="udp" tabindex="-1"><a class="header-anchor" href="#udp" aria-hidden="true">#</a> UDP</h3>
<p>UDP（用户数据报协议）：是OSI参考模型中的一种无连接<strong>传输层</strong>协议，提供面向事务的简单不可靠信息传输服务。
特点：
（1）udp是无连接的 即发送数据报无需建立连接，并因此减少了开销和发送数据之前不必要的时延；
（2）使用尽量大努力交付；
（3）是面向报文的</p>
<h2 id="网络层" tabindex="-1"><a class="header-anchor" href="#网络层" aria-hidden="true">#</a> 网络层</h2>
<h3 id="arp" tabindex="-1"><a class="header-anchor" href="#arp" aria-hidden="true">#</a> ARP</h3>
<p>每台主机都会在自己的ARP缓冲区中建立一个 ARP列表，以表示IP地址和MAC地址的对应关系。</p>
<p>当源主机需要将一个数据包要发送到目的主机时，会首先检查自己 ARP列表中是否存在该 IP地址对应的MAC地址。</p>
<p>如果有，就直接将数据包发送到这个MAC地址；如果没有，就向本地网段发起一个ARP请求的广播包，查询此目的主机对应的MAC地址。</p>
<p>此ARP请求数据包里包括源主机的IP地址、硬件地址、以及目的主机的IP地址。网络中所有的主机收到这个ARP请求后，会检查数据包中的目的IP是否和自己的IP地址一致。</p>
<p>如果不相同就忽略此数据包；如果相同，该主机首先将发送端的MAC地址和IP地址添加到自己的ARP列表中。</p>
<p>如果ARP表中已经存在该IP的信息，则将其覆盖，然后给源主机发送一个 ARP响应数据包，告诉对方自己是它需要查找的MAC地址。</p>
<p>源主机收到这个ARP响应数据包后，将得到的目的主机的IP地址和MAC地址添加到自己的ARP列表中，并利用此信息开始数据的传输。</p>
<p>如果源主机一直没有收到ARP响应数据包，表示ARP查询失败。</p>
<h3 id="rarp" tabindex="-1"><a class="header-anchor" href="#rarp" aria-hidden="true">#</a> RARP</h3>
<p>ARP协议是根据IP地址找其对应的MAC地址，而RARP则是根据MAC地址找其对应IP地址，所以称之为&quot;反向ARP&quot;。具有本地磁盘的系统引导时，一般是从磁盘上的配置文件中读取IP地址，然后即可直接用ARP协议找出与其对应的主机MAC地址。但是无盘机，如X终端或无盘工作站，启动时是通过MAC地址来寻址的，这时就需要通过RARP协议获取IP地址。</p>
<p>RARP的基本工作原理如下：</p>
<p>（1）发送端发送一个本地的RARP广播包，在此广播包中声明自己的MAC地址，并且请求任何收到此请求的RARP服务器分配一个IP地址。</p>
<p>（2）本地网段上的RARP服务器收到此请求后，检查其RARP列表，查找该MAC地址对应的IP地址。如果存在，RARP服务器就给源主机发送一个响应数据包，并将此IP地址提供给对方主机使用；如果不存在，RARP服务器对此不做任何响应。</p>
<p>（3）源端在收到从RARP服务器来的响应信息后，利用得到的IP地址进行通信；如果一直没有收到RARP服务器的响应信息，则表示初始化失败。</p>
<h2 id="链路层" tabindex="-1"><a class="header-anchor" href="#链路层" aria-hidden="true">#</a> 链路层</h2>
<h3 id="以太网协议" tabindex="-1"><a class="header-anchor" href="#以太网协议" aria-hidden="true">#</a> 以太网协议</h3>
<p>以太网规定，一组电信号构成一个数据包，叫做帧，每一帧分成两个部分：标头（Head）和数据（Data）。</p>
<p>“标头”包含数据包的一些说明项，比如发送者、接受者、数据类型等等；“数据”则是数据包的具体内容。</p>
<p>“标头”的长度，固定为18字节。“数据”的长度，最短为46字节，最长为1500字节。因此，整个帧最短为64字节，最长为1518字节。如果数据很长，就必须分割成多个帧进行发送。</p>
<h3 id="mac地址" tabindex="-1"><a class="header-anchor" href="#mac地址" aria-hidden="true">#</a> MAC地址</h3>
<p>发送者和接受者如何标识呢？</p>
<p>以太网规定，进入网络所有设备，都必须具有“网卡”接口。数据包必须是从一块网卡。传送到另一块网卡。网卡的地址，就是数据包的发送地址和接收地址，这叫做MAC地址。</p>
<p>每块网卡出厂的时候，都有一个全世界独一无二的ＭＡＣ地址，长度是４８个二进制位，通常用１２个十六进制数表示。</p>
<h2 id="物理层" tabindex="-1"><a class="header-anchor" href="#物理层" aria-hidden="true">#</a> 物理层</h2>
</template>
