import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render /*, click*/ } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { set, computed } from '@ember/object';
import Component from '@ember/component';
import { layout } from '@ember-decorators/component';

module('Integration | Component | my-component', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    class MyService extends Service {
      value = true;

      @computed('value')
      get flag() {
        return this.value;
      }

      notify() {
        set(this, 'value', !this.value);
      }
    }
    this.owner.register('service:my-service', MyService);

    @layout(hbs`
    <div>
      {{@service.flag}}
      <button type="button"></button>
    </div>
    `)
    class MyComponent extends Component {}

    this.owner.register('component:my-component', MyComponent);

    const myService = this.owner.lookup('service:my-service');

    this.set('myService', myService);
    await render(hbs`
      <MyComponent @service={{this.myService}}/>
    `);

    assert.dom().hasText('true');
    myService.notify();
    // await click('button');
    assert.dom().hasText('false');
  });
});
