## 一次使用soap，webservice, wsdl的体验
### 在node的项目中使用soap模块对接搜狗API服务
- 由于公司业务需求，需要通过搜狗API对接获取公司在搜狗推广消费效果的报表数据，搜狗API使用soap和webservice提供接口服务，我在node项目中使用了soap模块进行对接获取数据。

#### soap

- <a href='http://www.hudong.com/wiki/SOAP'>关于soap的解释</a>

#### webservice

- <a href='http://www.baike.com/wiki/WebService'>关于webservice的解释</a>

#### wsdl

- <a href='http://www.baike.com/wiki/wsdl'>关于wsdl的解释</a>

#### node的项目中的soap模块
- 可以 npmjs.org中直接搜索soap，了解具体API
- 在本项目中，需要使用 addSoapHeader 函数，添加 soapHeader,需要注意添加的namespace为：'v1', xmlns为： 'http://api.sogou.com/sem/common/v1',具体可参考代码


